package br.com.udesc.turma_do_gatil_back.repositories.impl;

import br.com.udesc.turma_do_gatil_back.entities.Cat;
import br.com.udesc.turma_do_gatil_back.entities.QCat;
import br.com.udesc.turma_do_gatil_back.enums.CatAdoptionStatus;
import br.com.udesc.turma_do_gatil_back.enums.Color;
import br.com.udesc.turma_do_gatil_back.enums.Sex;
import br.com.udesc.turma_do_gatil_back.repositories.CatRepositoryCustom;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Repository
public class CatRepositoryImpl implements CatRepositoryCustom {

    @Autowired
    private JPAQueryFactory queryFactory;

    private final QCat qCat = QCat.cat;

    @Override
    public Page<Cat> findWithFilters(String name, Color color, Sex sex, CatAdoptionStatus adoptionStatus, Pageable pageable) {
        BooleanBuilder predicate = new BooleanBuilder();

        if (StringUtils.hasText(name)) {
            predicate.and(qCat.name.containsIgnoreCase(name));
        }

        if (color != null) {
            predicate.and(qCat.color.eq(color));
        }

        if (sex != null) {
            predicate.and(qCat.sex.eq(sex));
        }

        if (adoptionStatus != null) {
            predicate.and(qCat.adoptionStatus.eq(adoptionStatus));
        }

        JPAQuery<Cat> query = queryFactory.selectFrom(qCat)
                .where(predicate);

        // Aplicar ordenação dinâmica
        OrderSpecifier<?>[] orderSpecifiers = getOrderSpecifiers(pageable.getSort());
        if (orderSpecifiers.length > 0) {
            query.orderBy(orderSpecifiers);
        } else {
            query.orderBy(qCat.name.asc());
        }

        long total = query.fetchCount();

        List<Cat> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Cat> findByAdoptionStatus(CatAdoptionStatus adoptionStatus, Pageable pageable) {
        JPAQuery<Cat> query = queryFactory.selectFrom(qCat)
                .where(qCat.adoptionStatus.eq(adoptionStatus));

        // Aplicar ordenação dinâmica
        OrderSpecifier<?>[] orderSpecifiers = getOrderSpecifiers(pageable.getSort());
        if (orderSpecifiers.length > 0) {
            query.orderBy(orderSpecifiers);
        } else {
            query.orderBy(qCat.name.asc());
        }

        long total = query.fetchCount();

        List<Cat> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public List<Cat> findByAdoptionStatusList(CatAdoptionStatus adoptionStatus) {
        return queryFactory.selectFrom(qCat)
                .where(qCat.adoptionStatus.eq(adoptionStatus))
                .orderBy(qCat.name.asc())
                .fetch();
    }

    @Override
    public Page<Cat> findByColor(Color color, Pageable pageable) {
        JPAQuery<Cat> query = queryFactory.selectFrom(qCat)
                .where(qCat.color.eq(color));

        // Aplicar ordenação dinâmica
        OrderSpecifier<?>[] orderSpecifiers = getOrderSpecifiers(pageable.getSort());
        if (orderSpecifiers.length > 0) {
            query.orderBy(orderSpecifiers);
        } else {
            query.orderBy(qCat.name.asc());
        }

        long total = query.fetchCount();

        List<Cat> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Cat> findBySex(Sex sex, Pageable pageable) {
        JPAQuery<Cat> query = queryFactory.selectFrom(qCat)
                .where(qCat.sex.eq(sex));

        // Aplicar ordenação dinâmica
        OrderSpecifier<?>[] orderSpecifiers = getOrderSpecifiers(pageable.getSort());
        if (orderSpecifiers.length > 0) {
            query.orderBy(orderSpecifiers);
        } else {
            query.orderBy(qCat.name.asc());
        }

        long total = query.fetchCount();

        List<Cat> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Cat> findByNameContainingIgnoreCase(String name, Pageable pageable) {
        JPAQuery<Cat> query = queryFactory.selectFrom(qCat)
                .where(qCat.name.containsIgnoreCase(name));

        // Aplicar ordenação dinâmica
        OrderSpecifier<?>[] orderSpecifiers = getOrderSpecifiers(pageable.getSort());
        if (orderSpecifiers.length > 0) {
            query.orderBy(orderSpecifiers);
        } else {
            query.orderBy(qCat.name.asc());
        }

        long total = query.fetchCount();

        List<Cat> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public long countByAdoptionStatus(CatAdoptionStatus adoptionStatus) {
        return queryFactory.selectFrom(qCat)
                .where(qCat.adoptionStatus.eq(adoptionStatus))
                .fetchCount();
    }

    /**
     * Converte Sort do Spring para OrderSpecifier do QueryDSL
     */
    private OrderSpecifier<?>[] getOrderSpecifiers(Sort sort) {
        List<OrderSpecifier<?>> orders = new ArrayList<>();

        for (Sort.Order order : sort) {
            String property = order.getProperty();
            boolean isAscending = order.isAscending();

            switch (property) {
                case "name":
                    orders.add(isAscending ? qCat.name.asc() : qCat.name.desc());
                    break;
                case "birthDate":
                    orders.add(isAscending ? qCat.birthDate.asc() : qCat.birthDate.desc());
                    break;
                case "color":
                    orders.add(isAscending ? qCat.color.asc() : qCat.color.desc());
                    break;
                case "sex":
                    orders.add(isAscending ? qCat.sex.asc() : qCat.sex.desc());
                    break;
                case "adoptionStatus":
                    orders.add(isAscending ? qCat.adoptionStatus.asc() : qCat.adoptionStatus.desc());
                    break;
                case "shelterEntryDate":
                    orders.add(isAscending ? qCat.shelterEntryDate.asc() : qCat.shelterEntryDate.desc());
                    break;
                default:
                    // Se a propriedade não for reconhecida, ordena por nome
                    orders.add(qCat.name.asc());
                    break;
            }
        }

        return orders.toArray(new OrderSpecifier<?>[0]);
    }
}