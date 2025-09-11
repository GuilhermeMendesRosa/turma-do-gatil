package br.com.udesc.turma_do_gatil_back.repositories.impl;

import br.com.udesc.turma_do_gatil_back.entities.Adoption;
import br.com.udesc.turma_do_gatil_back.entities.QAdoption;
import br.com.udesc.turma_do_gatil_back.enums.AdoptionStatus;
import br.com.udesc.turma_do_gatil_back.repositories.AdoptionRepositoryCustom;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public class AdoptionRepositoryImpl implements AdoptionRepositoryCustom {

    @Autowired
    private JPAQueryFactory queryFactory;

    private final QAdoption qAdoption = QAdoption.adoption;

    @Override
    public Page<Adoption> findWithFilters(AdoptionStatus status, UUID catId, UUID adopterId,
                                          LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        BooleanBuilder predicate = new BooleanBuilder();

        if (status != null) {
            predicate.and(qAdoption.status.eq(status));
        }

        if (catId != null) {
            predicate.and(qAdoption.catId.eq(catId));
        }

        if (adopterId != null) {
            predicate.and(qAdoption.adopterId.eq(adopterId));
        }

        if (startDate != null) {
            predicate.and(qAdoption.adoptionDate.goe(startDate));
        }

        if (endDate != null) {
            predicate.and(qAdoption.adoptionDate.loe(endDate));
        }

        JPAQuery<Adoption> query = queryFactory.selectFrom(qAdoption)
                .where(predicate)
                .orderBy(qAdoption.adoptionDate.desc());

        long total = query.fetchCount();

        List<Adoption> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Adoption> findByStatus(AdoptionStatus status, Pageable pageable) {
        JPAQuery<Adoption> query = queryFactory.selectFrom(qAdoption)
                .where(qAdoption.status.eq(status))
                .orderBy(qAdoption.adoptionDate.desc());

        long total = query.fetchCount();

        List<Adoption> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Adoption> findByCatId(UUID catId, Pageable pageable) {
        JPAQuery<Adoption> query = queryFactory.selectFrom(qAdoption)
                .where(qAdoption.catId.eq(catId))
                .orderBy(qAdoption.adoptionDate.desc());

        long total = query.fetchCount();

        List<Adoption> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Adoption> findByAdopterId(UUID adopterId, Pageable pageable) {
        JPAQuery<Adoption> query = queryFactory.selectFrom(qAdoption)
                .where(qAdoption.adopterId.eq(adopterId))
                .orderBy(qAdoption.adoptionDate.desc());

        long total = query.fetchCount();

        List<Adoption> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Adoption> findByAdoptionDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        JPAQuery<Adoption> query = queryFactory.selectFrom(qAdoption)
                .where(qAdoption.adoptionDate.between(startDate, endDate))
                .orderBy(qAdoption.adoptionDate.desc());

        long total = query.fetchCount();

        List<Adoption> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public List<Adoption> findByCatIdAndStatus(UUID catId, AdoptionStatus status) {
        return queryFactory.selectFrom(qAdoption)
                .where(qAdoption.catId.eq(catId)
                        .and(qAdoption.status.eq(status)))
                .orderBy(qAdoption.adoptionDate.desc())
                .fetch();
    }
}
