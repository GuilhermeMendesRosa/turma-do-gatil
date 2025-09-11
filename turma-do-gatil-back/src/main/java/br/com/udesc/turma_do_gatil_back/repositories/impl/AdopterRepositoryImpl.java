package br.com.udesc.turma_do_gatil_back.repositories.impl;

import br.com.udesc.turma_do_gatil_back.entities.Adopter;
import br.com.udesc.turma_do_gatil_back.entities.QAdopter;
import br.com.udesc.turma_do_gatil_back.repositories.AdopterRepositoryCustom;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

@Repository
public class AdopterRepositoryImpl implements AdopterRepositoryCustom {

    @Autowired
    private JPAQueryFactory queryFactory;

    private final QAdopter qAdopter = QAdopter.adopter;

    @Override
    public Page<Adopter> findWithFilters(String name, String email, String cpf, Pageable pageable) {
        BooleanBuilder predicate = new BooleanBuilder();

        if (StringUtils.hasText(name)) {
            predicate.and(
                    qAdopter.firstName.containsIgnoreCase(name)
                            .or(qAdopter.lastName.containsIgnoreCase(name))
                            .or(Expressions.stringTemplate("concat({0}, ' ', {1})",
                                    qAdopter.firstName, qAdopter.lastName).containsIgnoreCase(name))
            );
        }

        if (StringUtils.hasText(email)) {
            predicate.and(qAdopter.email.containsIgnoreCase(email));
        }

        if (StringUtils.hasText(cpf)) {
            predicate.and(qAdopter.cpf.contains(cpf));
        }

        JPAQuery<Adopter> query = queryFactory.selectFrom(qAdopter)
                .where(predicate)
                .orderBy(qAdopter.firstName.asc());

        long total = query.fetchCount();

        List<Adopter> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Adopter> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName, Pageable pageable) {
        BooleanBuilder predicate = new BooleanBuilder();

        if (StringUtils.hasText(firstName)) {
            predicate.and(qAdopter.firstName.containsIgnoreCase(firstName));
        }

        if (StringUtils.hasText(lastName)) {
            predicate.and(qAdopter.lastName.containsIgnoreCase(lastName));
        }

        JPAQuery<Adopter> query = queryFactory.selectFrom(qAdopter)
                .where(predicate)
                .orderBy(qAdopter.firstName.asc());

        long total = query.fetchCount();

        List<Adopter> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Adopter> findByEmailContainingIgnoreCase(String email, Pageable pageable) {
        JPAQuery<Adopter> query = queryFactory.selectFrom(qAdopter)
                .where(qAdopter.email.containsIgnoreCase(email))
                .orderBy(qAdopter.email.asc());

        long total = query.fetchCount();

        List<Adopter> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }
}
